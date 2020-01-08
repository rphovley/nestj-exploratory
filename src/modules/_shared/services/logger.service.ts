import {
  LoggerService as NestLoggerService,
  Injectable,
  Logger,
} from '@nestjs/common';
import awsSdk from 'aws-sdk';
import winston from 'winston';
import { Session } from '../utils/session';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class LoggerService extends Logger implements NestLoggerService {
  private readonly awsCloudWatchLogsInstance: awsSdk.CloudWatchLogs;
  private readonly logger;

  constructor(private readonly session: Session) {
    super();

    this.awsCloudWatchLogsInstance = new awsSdk.CloudWatchLogs({
      apiVersion: '2014-03-28',
      region: process.env.AWS_CLOUDWATCHLOGS_REGION,
    });

    this.logger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/errors.log',
          level: 'error',
        }),
      ],
    });
  }

  getLogDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    return `${mm}/${dd}/${yyyy} ${hours}:${minutes}:${seconds}`;
  }

  private async registerOnAmazonCloudWatchLogs(
    level: string,
    message: string,
  ): Promise<boolean> {

    let requestMessage:string = `[${level.toLocaleUpperCase()}]`;
    const user: User = this.getSessionLoggedUser();
    if (user && user.id) {
      requestMessage += `[LoggedUserID ${user.id}]`;
    }

    requestMessage += ` - ${message}`;

    return new Promise((resolve, reject) => {
      this.awsCloudWatchLogsInstance.createLogStream(
        {
          logGroupName: process.env.AWS_CLOUDWATCHLOGS_GROUPNAME,
          logStreamName: requestMessage.replace(/:/g, '.').substring(0, 512),
        },
        (err, data) => {
          if (err) {
            this.logger.error(`${err} on ${__filename}`);
            resolve(false);
          } else if (data === null) {
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });
  }

  log(message: any, context?: string): void {
    super.log(message, context);
  }

  private getSessionLoggedUser(): User {
    return this.session.getObject<User>('user-auth');
  }

  info(message: any): void {
    this.registerOnAmazonCloudWatchLogs(
      'info',
      `${message}`,
    );
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.registerOnAmazonCloudWatchLogs('error', `${Date.now()} - ${message}`);
    this.logger.error(`${message} \n ${trace}`);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }
}

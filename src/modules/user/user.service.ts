import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../_shared/services/base.service';
import { EmailService } from '../_shared/services/email.service';
import { Hash } from '../_shared/utils/hash';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';
import { Session } from '../_shared/utils/session';
import { Serialize } from '../_shared/utils/serialize';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly session: Session,
    private readonly serialize: Serialize,
  ) {
    super();
  }

  async find(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async login(data: Partial<AuthLoginDto>): Promise<User> {
    const user = await this.findUserByEmail(data.username, false);
    if (!user || !user.isActive) {
      return null;
    }

    if (!(await Hash.match(data.password, user.password))) {
      return null;
    }

    return user;
  }

  async create(data: Partial<User>): Promise<User> {
    if (data?.password) {
      data.password = await Hash.create(data.password);
    }

    data.isActive = false;
    data.isConfirmed = false;
    data.confirmationToken = Hash.createRandomSha1Hash();

    const user = await this.userRepo.create(data);
    await this.userRepo.save(user);

    this.sendConfirmationEmail(user);

    return user;
  }

  async validateConfirmationToken(token: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      confirmationToken: token,
      isActive: false,
      isConfirmed: false,
    });

    if (!user) {
      throw new BadRequestException();
    }

    await this.confirmUser(user);
    return true;
  }

  async validateRecoverToken(token: string): Promise<User> {
    return await this.userRepo.findOne({
      recoverToken: token,
      isActive: true,
      isConfirmed: true,
    });
  }

  async emailAddressExists(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({
      email,
      isActive: true,
      isConfirmed: true,
    });

    if (!user) {
      return false;
    }

    return true;
  }

  async findUserByEmail(
    email: string,
    considerConfirmed: boolean = true,
    considerActive: boolean = true,
  ): Promise<User> {
    const criteria: any = {
      email,
    };

    if (considerConfirmed) {
      criteria.isConfirmed = true;
    }

    if (considerActive) {
      criteria.isActive = true;
    }

    return await this.userRepo.findOne(criteria);
  }

  async confirmUser(user: User): Promise<User> {
    user.confirmationToken = null;
    user.isActive = true;
    user.isConfirmed = true;
    return await this.userRepo.save(user);
  }

  async generateRecoverCode(user: User): Promise<boolean> {
    user.recoverToken = Hash.createRandomSha1Hash();
    await this.userRepo.save(user);

    this.sendRecoverEmail(user);

    return true;
  }

  async setNewPassword(user: User, password: string): Promise<User> {
    user.recoverToken = null;
    user.password = await Hash.create(password);
    return await this.userRepo.save(user);
  }

  authenticateSession(user: User): void {
    const userAuthenticationData = this.serialize.serialize(user);
    this.session.store('user-auth', userAuthenticationData);
  }

  logout(): void {
    this.session.destroy('user-auth');
  }

  async sendConfirmationEmail(user: User): Promise<void> {
    const link: string = `${process.env.APP_AUTH_CONFIRMATION_URI}?code=${user.confirmationToken}`;

    EmailService.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: 'ev_ms_confirmation_email',
      'v:name': user.firstName,
      'v:link': link,
    });

    return;
  }

  async sendRecoverEmail(user: User): Promise<void> {
    const link: string = `${process.env.APP_AUTH_RECOVER_PASSWORD_URI}?code=${user.recoverToken}`;

    EmailService.sendMail({
      to: user.email,
      subject: 'Recover your password',
      template: 'ev_ms_recover_password_email',
      'v:name': user.firstName,
      'v:link': link,
    });

    return;
  }
}

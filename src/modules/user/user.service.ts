import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../_shared/services/base.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { EmailService } from '../_shared/services/email.service';

@Injectable()
export class UserService extends BaseService{

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        // private readonly mailerService: MailerService
    ){
        super();
    }

    async find(): Promise<User[]>{
        return await this.userRepo.find();
    }

	async create(data: Partial<User>): Promise<User>{
        if(data?.password){
            data.password = await bcrypt.hash(data.password, bcrypt.genSaltSync(10))
        }

        data.isActive = false;
        data.isConfirmed = false;
        data.confirmationToken = crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');

        const user = await this.userRepo.create(data);
        await this.userRepo.save(user);
        
        this.sendConfirmationEmail(user);

        return user;
    }

    async validateConfirmationToken(token: string): Promise<boolean>{
        const user = await this.userRepo.findOne({
            confirmationToken: token,
            isActive: false,
            isConfirmed: false
        });

        if(user){
            await this.confirmUser(user);
            return true;
        }
        else{
            return false;
        }
    }

    async emailAddressExists(email: string): Promise<boolean>{
        const user = await this.userRepo.findOne({
            email
        });

        if(user){
            return true;
        }
        else{
            return false;
        }
    }

    async confirmUser(user: User): Promise<User>{ 
        user.confirmationToken = null;
        user.isActive = true;
        user.isConfirmed = true;       
        return await this.userRepo.save(user);
    }

    async sendConfirmationEmail(user: User): Promise<void>{

        const link:string = process.env.APP_AUTH_CONFIRMATION_URI + '?code=' + user.confirmationToken;

        EmailService.sendMail({
            to: user.email,
            subject: 'Confirm your email',
            template: 'ev_ms_confirmation_email',
            'v:name': user.firstName,
            'v:link': link
        });

        return;
    }
}
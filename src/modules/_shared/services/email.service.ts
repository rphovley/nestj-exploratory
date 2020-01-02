import nodemailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import { Injectable } from '@nestjs/common';
import { reject } from 'bluebird';

@Injectable()
export class EmailService{

    public static getTransporter(){
        if(process.env.MAIL_SERVICE === 'mailgun'){
            return this.getMailgunTransporter();
        }
    }

    public static getMailgunTransporter(){
        return nodemailer.createTransport(mg({
            auth:{
                domain: 'pingadoweb.com.br',
                api_key: 'key-ffa03763c869bd2c04788840cb326bb7'
            }
        }));
    }

    public static async sendMail(options: any){
        return new Promise((resolve, reject) => {
            const transporter = this.getTransporter();

            if(!options?.from){
                options.from = process.env.MAIL_SERVICE_FROM_NAME + '<' + process.env.MAIL_SERVICE_FROM + '>'
            }

            transporter.sendMail(options).then(result => resolve(result)).catch(err => reject(err));
        });
    }
}
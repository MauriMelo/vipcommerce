import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import config from '../../config/mail';

const nodemailshbs = require('nodemailer-express-handlebars');

class Mail {
  private transport;

  constructor() {
    const { host, port, secure, auth } = config as any;
    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    const viewPath = resolve(__dirname, '..', 'views', 'mail');
    this.transport.use(
      'compile',
      nodemailshbs({
        viewEngine: exphbs.create({
          layoutsDir: viewPath,
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message: any) {
    return this.transport.sendMail({
      ...config.default,
      ...message,
    });
  }
}

export default new Mail();

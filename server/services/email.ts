import EmailTemplates from 'email-templates'
import nodemailer from 'nodemailer'
import sgTransport from 'nodemailer-sendgrid-transport'
import path from 'path'

import CONFIG from '@server/config'
import { IUser } from '@schema/user'
import log from '@utility/log'

export let email = global?.store?.email

const EMAIL_TEMPLATE_DIR = "assets/templates"

export const setup_email = ({host = CONFIG.EMAIL_HOST, port = CONFIG.EMAIL_PORT, secure = CONFIG.EMAIL_SECURE, user = CONFIG.EMAIL_USER, pass = CONFIG.EMAIL_PASS, sendgrid = CONFIG.EMAIL_SENDGRID}) => {
  let opts
  if (sendgrid) {
    opts = sgTransport({
      auth: {
        api_user: user,
        api_key: pass
      }
    })
  } else {
    opts = {
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      }
    }
  }

  const transporter = nodemailer.createTransport(opts);

  email = global.store.email = new EmailTemplates({
    message: {
      from: 'komplent@komplent.com'
    },
    send: true,
    preview: false,
    transport: transporter,
    views: {
      options: {
        extension: 'njk'
      }
    },
    getPath: (type, template) => {
       const p = path.join(process.cwd(), EMAIL_TEMPLATE_DIR, template, type)
       return p
      }
    });
    
}

export enum Template {
  recover_login = "recover_login",
  confirm_email = "confirm_email"
}

interface SendEmailProps {
  template: Template
  to: string | IUser
  from?: 'support' | 'info'
  user?: string | IUser
  locals?: object
}

export const send_email = (props: SendEmailProps) => {
  let locals: any = {}
  let tmpl = props.template.valueOf()
  switch (props.template) {
    case Template.confirm_email:
      {
        if (props.user) {
          locals.user = props.user
        }
        break;
      }
  
    default:
      break;
  }

  log.debug(`Email template path: ${path.join(process.cwd(), EMAIL_TEMPLATE_DIR, tmpl)}`)

  locals = Object.assign(locals, props.locals ?? {})

  let from
  switch (props.from) {
    case 'support':
      from = 'support'
      break
    case 'info':
      from = 'info'
      break
    default:
      from = 'komplent'
      break;
  }

  from = `${from}@${CONFIG.EMAIL_DOMAIN}`

  let to = typeof props.to === 'string' ? props.to : props.to.email

  log.debug(`Sending (${props.template.toString()}) email to ${to} from ${from}`)
  
  if (tmpl && to && from) {
    email.send({
      template: tmpl,
      message: {
        to,
        from
      },
      locals
    })
    log.debug(`Email (${props.template.toString()}) sent to ${to} from ${from}`)
  } else {
    log.error(`Failed to send email (${props.template.toString()}) to ${to} from ${from}`)
    throw Error(`Failed to send email: ${tmpl} - ${to} - ${from} `)
  }
}

export default email
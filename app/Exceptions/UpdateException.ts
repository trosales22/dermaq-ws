import { Exception } from '@adonisjs/core/build/standalone'
import Logger from "@ioc:Adonis/Core/Logger"
import Env from '@ioc:Adonis/Core/Env'

export default class UpdateException extends Exception {
  constructor(module: string, message: string, code: number = 400){
    let errorMessage: string | null = null;

    if(Env.get('NODE_ENV') === 'development'){
      errorMessage = message
    }else{
      Logger.info('UpdateException: ' + message)
      errorMessage = `Something went wrong while updating ${module}. Check logs for details.`
    }

    super(errorMessage, code)
  }
}

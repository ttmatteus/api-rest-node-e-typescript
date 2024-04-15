import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Schema, ValidationError } from "yup";

// Definindo tipos personalizados para facilitar a leitura do código
type TProperty = 'body' | 'header' | 'params' | 'query';

// Definindo tipos de funções para esquemas Yup
type TGetSchema = <T>(schema: Schema<T>) => Schema<any>;

// Definindo um tipo para todos os esquemas Yup
type TAllSchemas = Record<TProperty, Schema<any>>;

// Definindo um tipo de função para obter todos os esquemas Yup
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;

// Definindo um tipo de função para validação de requisições
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

// Middleware de validação de dados
export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
  // Obtendo todos os esquemas de validação para cada parte da requisição
  const schemas = getAllSchemas(schema => schema);

  // Objeto para armazenar os erros de validação encontrados
  const errosResult: Record<string, Record<string, string>> = {};

  // Iterando sobre cada esquema de validação e validando os dados da requisição
  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      // Validando os dados e tratando erros de validação
      schema.validateSync(req[key as TProperty], { abortEarly: false });
     } catch (err) {
       const yupError = err as ValidationError;
       const erros: Record<string, string> = {};
   
       // Construindo um objeto de erros para cada campo inválido
       yupError.inner.forEach(error => {
         if (!error.path) return;
         erros[error.path] = error.message;
       });

       // Armazenando os erros no objeto de resultados
       errosResult[key] = erros;
     }
  });

  // Verificando se foram encontrados erros de validação
  if (Object.entries(errosResult).length === 0 ){
    // Se não houver erros, passa para o próximo middleware
    return next();
  } else {
    // Se houver erros, retorna uma resposta com status de erro e os erros encontrados
    return res.status(StatusCodes.BAD_REQUEST).json({ errosResult });
  }
};

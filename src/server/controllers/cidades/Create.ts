import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';


interface ICidade {
  name: string;
}

const bodyValidation: yup.Schema<ICidade> = yup.object().shape({
  name: yup.string().required('O campo nome é obrigatório').min(3, 'O campo nome deve ter no mínimo 3 caracteres'),
  estado: yup.string().required('O campo estado é obrigatório').min(3, 'O campo deve ter no mínimo 3 caracteres'),
});


export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
let validadeData: ICidade | undefined = undefined

  try {
   validadeData = await bodyValidation.validate(req.body);
  } catch (error) {
    const yupError = error as yup.ValidationError;

    return res.status(StatusCodes.BAD_REQUEST).json({
      erros: {
        default: yupError.message,
      }
    });
  }

  console.log(validadeData);

  
  return res.send('Create');
};

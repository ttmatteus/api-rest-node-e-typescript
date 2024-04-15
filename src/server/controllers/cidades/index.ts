import * as create from './Create'
import * as getAll from './GetAll';

export const CidadesController = {
  ...create,
  ...getAll
}

CidadesController.create
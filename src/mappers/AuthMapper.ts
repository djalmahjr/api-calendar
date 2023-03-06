import { BaseObjectMap } from './../types/Mapper';

type AuthMapped = {
  token: string;
  expiresIn: number;
};

const objectMap: BaseObjectMap<AuthMapped, AuthMapped> = (
  object: AuthMapped
) => {
  return {
    token: object.token,
    expiresIn: object.expiresIn,
  };
};

export default {
  objectMap,
};

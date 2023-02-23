import { BaseArrayMap, BaseObjectMap } from './../types/Mapper';
import { User } from '@djalmahjr/lib-database-calendar';
import { BaseMap } from '../types/Mapper';

type UserMapped = {
  guid: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

const map: BaseMap<UserMapped, User> = (data: User[] | User) => {
  if (!Array.isArray(data)) {
    return objectMap(data);
  } else {
    return arrayMap(data);
  }
};

const arrayMap: BaseArrayMap<UserMapped, User> = (array: User[]) => {
  const mapped = [];
  for (const object of array) {
    mapped.push(objectMap(object));
  }

  return mapped;
};

const objectMap: BaseObjectMap<UserMapped, User> = (object: User) => {
  return {
    guid: object.guid,
    email: object.email,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  };
};

export default {
  map,
  arrayMap,
  objectMap,
};

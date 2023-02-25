import { BaseArrayMap, BaseObjectMap } from './../types/Mapper';
import { Event } from '@djalmahjr/lib-database-calendar';
import { BaseMap } from '../types/Mapper';

type EventMapped = {
  guid: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  notificationTime: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const map: BaseMap<EventMapped, Event> = (data: Event[] | Event) => {
  if (!Array.isArray(data)) {
    return objectMap(data);
  } else {
    return arrayMap(data);
  }
};

const arrayMap: BaseArrayMap<EventMapped, Event> = (array: Event[]) => {
  const mapped = [];
  for (const object of array) {
    mapped.push(objectMap(object));
  }

  return mapped;
};

const objectMap: BaseObjectMap<EventMapped, Event> = (object: Event) => {
  return {
    guid: object.guid,
    title: object.title,
    description: object.description,
    startTime: object.startTime,
    endTime: object.endTime,
    notificationTime: object?.notificationTime || null,
    createdAt: object.createdAt,
    updatedAt: object.updatedAt,
  };
};

export default {
  map,
  arrayMap,
  objectMap,
};

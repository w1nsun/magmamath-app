export const USER_CREATED_EVENT = 'user.created';
export const USER_DELETED_EVENT = 'user.deleted';

export type TUserEventName = typeof USER_CREATED_EVENT | typeof USER_DELETED_EVENT;
export type TUserData = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type TUserEvent = {
  event: TUserEventName;
  data: TUserData;
};

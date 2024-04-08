import { CoreEntity } from 'src/common/entities/core.entity';
// import { User } from 'src/users/entities/user.entity';
import { UsersModel } from 'src/users/schema/user';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export class Address extends CoreEntity {
  title: string;
  default: boolean;
  address: UserAddress;
  type: AddressType;
  customer: UsersModel;
}
export class UserAddress {
  street_address: string;
  country: string;
  city: string;
  state: string;
  zip: string;
}

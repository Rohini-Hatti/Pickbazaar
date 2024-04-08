import { Injectable, Req } from '@nestjs/common';
import {
  AuthResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  CoreResponse,
  RegisterDto,
  ResetPasswordDto,
  VerifyForgetPasswordDto,
  SocialLoginDto,
  OtpLoginDto,
  OtpResponse,
  VerifyOtpDto,
  OtpDto,
} from './dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import usersJson from '@db/users.json';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModel } from 'src/users/schema/user';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
const users = plainToClass(User, usersJson);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UsersModel.name)
    private userModel: mongoose.Model<UsersModel>,
  ) {}
  private users: User[] = users;
  async register(createUserInput: RegisterDto): Promise<AuthResponse> {
    let newObj = {
      ...createUserInput,
      permissions: [createUserInput.permission],
    };
    delete newObj.permission;
    let user;
    user = await this.userModel.findOne({ email: createUserInput.email });
    if (!user) {
      user = await this.userModel.create(newObj);
    }
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);
    if (createUserInput.email === 'admin@demo.com') {
      return {
        token: token,
        permissions: ['super_admin', 'customer'],
      };
    }
    return {
      token: token,
      permissions: [createUserInput.permission],
    };

    // const user: User = {
    //   id: uuidv4(),
    //   ...users[0],
    //   ...createUserInput,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    // };

    this.users.push(user);
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
    };
  }
  async login(loginInput: LoginDto): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email: loginInput.email });
    if (!user) {
      return {
        token: '',
        permissions: [],
        role: '',
      };
    }
    if (user.password !== loginInput.password) {
      return {
        token: '',
        permissions: [],
        role: '',
      };
    }
    const payload = { email: user.email, sub: user.id };
    const jwtToken = this.jwtService.sign(payload);

    return {
      token: jwtToken,
      permissions: user.permissions,
    };
    // if (loginInput.email === 'admin@demo.com') {
    //   return {
    //     token: 'jwt token',
    //     permissions: ['store_owner', 'super_admin'],
    //     role: 'super_admin',
    //   };
    // } else if (
    //   ['store_owner@demo.com', 'vendor@demo.com'].includes(loginInput.email)
    // ) {
    //   return {
    //     token: 'jwt token',
    //     permissions: ['store_owner', 'customer'],
    //     role: 'store_owner',
    //   };
    // } else {
    //   return {
    //     token: 'jwt token',
    //     permissions: ['customer'],
    //     role: 'customer',
    //   };
    // }
  }
  async changePassword(
    changePasswordInput: ChangePasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
      role: 'customer',
    };
  }
  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    return {
      token: 'jwt token',
      permissions: ['super_admin', 'customer'],
      role: 'customer',
    };
  }
  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<CoreResponse> {
    return {
      message: 'success',
      success: true,
    };
  }
  async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  // async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }
  // public getUser(getUserArgs: GetUserArgs): User {
  //   return this.users.find((user) => user.id === getUserArgs.id);
  // }
  me(request?: any): User {
    // if (request && request.user && request.user.email) {
    // return await this.userModel.findOne({ email: request.user.email });
    // } else {
    // throw new Error('Invalid request');
    // }
    console.log(request?.user);
    return this.users[0];
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }
}

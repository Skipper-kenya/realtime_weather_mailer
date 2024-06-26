import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(details: User, res: any): Promise<any> {
    try {
      const user = await this.userModel.findOne({ username: details.username });

      if (user) {
        return res
          .status(200)
          .send({ success: false, message: 'user already exists' });
      } else {
        const hashedPassword = await bcrypt.hash(details?.password, 10);

        const newUser = new this.userModel({
          ...details,
          password: hashedPassword
        });
        await newUser.save();

        return res.status(200).send({ success: true, message: 'user created' });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(200).send({
        success: false,
        message: 'something went wrong'
      });
    }
  }

  async signin(username: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    return user;
  }
}

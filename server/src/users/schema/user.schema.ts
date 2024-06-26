import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({
    required: true
  })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true
  })
  username: string;

  @Prop({
    required: true
  })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);

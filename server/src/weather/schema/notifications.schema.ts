import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ required: true })
  email: string;

  @Prop()
  lastSent: number;
}

export const notificationsSchema = SchemaFactory.createForClass(Notifications);

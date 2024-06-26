import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Preference {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  preference: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  owner: string;
}

export const PreferenceSchema = SchemaFactory.createForClass(Preference);

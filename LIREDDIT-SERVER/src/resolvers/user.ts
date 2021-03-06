import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: String;

  @Field()
  message: String;
}

@ObjectType()
class UserRespose {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(()=>User,{nullable:true})
  async me(
    @Ctx(){req,em}: MyContext
  ){
    if(!req.session.UserID){
      return null
    }
    const user=await em.findOne(User,req.session.UserID)
    return user;
  }


  @Mutation(() => UserRespose)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em,req }: MyContext
  ): Promise<UserRespose> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "the username is too short",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "the password is too short <=2",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
      return { user: user };
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "the user already exists",
            },
          ],
        };
      }
      //store user id session,cookie to keep them logeg in
      req.session.UserID=user.id
      return { user: user };
    }
  }

  @Query(() => UserRespose)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em ,req}: MyContext
  ): Promise<UserRespose> {
    const userFound: User | null = await em.findOne(User, {
      username: options.username,
    });
    const loginError = {
      errors: [
        {
          field: "username",
          message: "could not find a user",
        },
      ],
    };//
    if (!userFound) {
      return loginError;
    }
    const valid = await argon2.verify(userFound.password, options.password);
    if (!valid) {
      return loginError;
    }//
    req.session.UserID= userFound.id;

    return {
      user: userFound,
    };
  }
}

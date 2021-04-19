import { IUserRepository } from '../IUserRepository'
import { User } from '../../models/userModel'
import { ICreateUserRequestDTO } from '../../useCases/createUser/createUserDTO'
import { IUser } from '../../interfaces/IUser'

export class MongodbUserRepository implements IUserRepository {
  async register (data: ICreateUserRequestDTO): Promise<boolean> {
    const newUser = new User({ name: data.name, email: data.email, password: data.password })
    if (await this.emailAlreadyExists(data.email)) {
      return false
    } else {
      return await newUser.save()
        .then(() => true)
        .catch(() => false)
    }
  }

  async login (email: string): Promise<IUser | null> {
    const user = await User.findOne({ email: email })
    if (user != null) {
      return user
    } else {
      return null
    }
  }

  async hasMotorcycle (userId: string): Promise<boolean> {
    return await User.findById(userId)
      .then(user => {
        if (user !== null) {
          return user.motorcycle.hasMotorcycle
        } else {
          return false
        }
      })
      .catch(() => false)
  }

  async getMotorcycleNumber (userId: string): Promise<number> {
    if (await this.hasMotorcycle(userId)) {
      return await User.findById(userId)
        .then((user: any) => {
          return user.motorcycle.motorcycleNumber
        })
        .catch(() => 0)
    } else {
      return 0
    }
  }

  async returnMotorcycle (userId: string): Promise<boolean> {
    return await User.findOneAndUpdate({ _id: userId }, { motorcycle: { hasMotorcycle: false, motorcycleNumber: 0 } })
      .then(user => {
        if (user != null) {
          return true
        } else {
          return false
        }
      })
      .catch(() => false)
  }

  async takeMotorcycle (userId: string, motorcycleNumber: number): Promise<boolean> {
    return await User.findByIdAndUpdate(userId, {
      motorcycle: {
        motorcycleNumber: motorcycleNumber,
        hasMotorcycle: true
      }
    })
      .then(user => {
        if (user != null) {
          return true
        } else {
          return false
        }
      })
      .catch(() => {
        return false
      })
  }

  private async emailAlreadyExists (email: string): Promise<boolean> {
    return await User.findOne({ email: email })
      .then(user => {
        if (user != null) {
          return true
        } else {
          return false
        }
      })
      .catch(() => false)
  }
}

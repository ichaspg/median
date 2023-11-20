// src/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return {
        status: 'success',
        data: {
          user: new UserEntity(createdUser),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        data: {
          message: 'Internal Server Error',
        },
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        data: {
          users: users.map((user) => new UserEntity(user)),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        data: {
          message: 'Internal Server Error',
        },
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return {
          status: 'fail',
          data: {
            message: 'User not Found',
          },
        };
      }
      return {
        status: 'success',
        data: {
          user: new UserEntity(user),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        data: {
          message: 'Internal Service Error',
        },
      };
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);

      if (!updatedUser) {
        return {
          status: 'fail',
          data: {
            message: 'User not found',
          },
        };
      }

      return {
        status: 'success',
        data: {
          user: new UserEntity(updatedUser),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        data: {
          message: 'Internal Server Error',
        },
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const removedUser = await this.usersService.remove(id);

      if (!removedUser) {
        return {
          status: 'fail',
          data: {
            message: 'User not found',
          },
        };
      }

      return {
        status: 'success',
        data: {
          user: new UserEntity(removedUser),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        data: {
          message: 'Internal Server Error',
        },
      };
    }
  }
}

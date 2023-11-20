// src/articles/articles.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.articlesService.create(createArticleDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll() {
    try {
      const articles = await this.articlesService.findAll();
      return {
        status: 'success',
        data: {
          articles: articles.map((article) => new ArticleEntity(article)),
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

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articlesService.findOne(id);

      if (!article) {
        return {
          status: 'fail',
          data: {
            meessage: 'Article not Found',
          },
        };
      }

      return {
        status: 'success',
        data: {
          article: new ArticleEntity(article),
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

  @Patch(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      const updatedArticle = await this.articlesService.update(
        id,
        updateArticleDto,
      );
      if (!updatedArticle) {
        return {
          staus: 'fail',
          data: {
            massage: 'Article not Found',
          },
        };
      }
      return {
        status: 'success',
        data: new ArticleEntity(updatedArticle),
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
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedArticle = await this.articlesService.remove(id);
      if (!deletedArticle) {
        return {
          status: 'fail',
          data: {
            message: 'Article not Found',
          },
        };
      }

      return {
        status: 'success',
        data: {
          article: new ArticleEntity(deletedArticle),
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

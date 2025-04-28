import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const image = request.body?.image;

    if (!image || typeof image !== 'string' || image.trim() === '') {
      throw new BadRequestException('Each item must have a valid image.');
    }

    return true;
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Writes a lightweight audit row (method, path, status, duration) for every
 * request — a small but real demonstration of cross-cutting concerns handled
 * with a Nest interceptor rather than sprinkled through controllers.
 */
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        // Fire-and-forget; never let logging break a response.
        this.prisma.activityLog
          .create({
            data: {
              action: `${req.method} ${req.route?.path ?? req.url}`,
              status: res.statusCode ?? 200,
              ms: Date.now() - started,
              ip: (req.ip ?? req.headers?.['x-forwarded-for'] ?? null) as string | null,
            },
          })
          .catch(() => undefined);
      }),
    );
  }
}

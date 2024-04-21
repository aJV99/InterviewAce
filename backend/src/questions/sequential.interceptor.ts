import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

const queues = {};

@Injectable()
export class SequentialUserRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming user object is available in request

    if (!queues[userId]) {
      queues[userId] = [];
    }

    return new Observable((observer) => {
      const executeRequest = () => {
        next
          .handle()
          .pipe(
            finalize(() => {
              // Remove the current request from the queue and execute the next one if exists
              queues[userId].shift();
              if (queues[userId].length > 0) {
                queues[userId][0]();
              }
            }),
          )
          .subscribe({
            next: (result) => observer.next(result),
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
          });
      };

      queues[userId].push(executeRequest);

      // If this is the only request in the queue, execute it immediately
      if (queues[userId].length === 1) {
        executeRequest();
      }
    });
  }
}

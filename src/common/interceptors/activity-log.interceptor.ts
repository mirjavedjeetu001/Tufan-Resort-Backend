import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;
    const body = request.body;

    // Skip logging for GET requests and certain paths
    if (method === 'GET' || url.includes('/activity-logs') || url.includes('/auth/login')) {
      return next.handle();
    }

    const entityTypeMap: { [key: string]: string } = {
      '/rooms': 'room',
      '/bookings': 'booking',
      '/users': 'user',
      '/convention-hall': 'convention-hall',
      '/convention-bookings': 'convention-booking',
      '/hero-slides': 'hero-slide',
      '/resort-info': 'resort-info',
      '/addon-services': 'addon-service',
    };

    let action = 'unknown';
    if (method === 'POST') action = 'create';
    else if (method === 'PUT' || method === 'PATCH') action = 'update';
    else if (method === 'DELETE') action = 'delete';

    let entityType = 'unknown';
    let entityId: number | undefined;

    // Determine entity type from URL
    for (const [path, type] of Object.entries(entityTypeMap)) {
      if (url.includes(path)) {
        entityType = type;
        
        // Extract ID from URL if present (e.g., /rooms/5)
        const idMatch = url.match(new RegExp(`${path}/(\\d+)`));
        if (idMatch) {
          entityId = parseInt(idMatch[1]);
        }
        break;
      }
    }

    // Get entity ID from body if not in URL (for POST requests)
    if (!entityId && body?.id) {
      entityId = body.id;
    }

    return next.handle().pipe(
      tap(async (response) => {
        // If response contains an id (newly created entity), use that
        if (response?.id && !entityId) {
          entityId = response.id;
        }

        if (user) {
          const description = this.generateDescription(action, entityType, body, response);

          await this.activityLogsService.createLog({
            userId: user.userId,
            userName: user.username || user.name || 'Unknown',
            userEmail: user.email || 'unknown@example.com',
            action,
            entityType,
            entityId,
            description,
            changes: method !== 'DELETE' ? body : null,
            ipAddress: ip,
          });
        }
      }),
    );
  }

  private generateDescription(action: string, entityType: string, body: any, response: any): string {
    const entityName = body?.name || body?.roomNumber || body?.customerName || body?.title || `${entityType} #${response?.id || body?.id || ''}`;
    
    switch (action) {
      case 'create':
        return `Created new ${entityType}: ${entityName}`;
      case 'update':
        return `Updated ${entityType}: ${entityName}`;
      case 'delete':
        return `Deleted ${entityType}: ${entityName}`;
      default:
        return `Performed ${action} on ${entityType}: ${entityName}`;
    }
  }
}

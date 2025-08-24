import { ToastService } from '../toast/toast';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, tap } from 'rxjs';
import { OperationType } from '../../enums/operation';

/** 
 * NOTA:
 * Como comentaba en la entrevista este servicio puede realizarse con un interceptor y aplicarlo general
 * Pero de esta manera se puede tener un control más fino sobre cada solicitud y donde colocar los componentes de loading
 * tambien permite manejar la carga y los mensajes de éxito/error de manera más granular
 * En mi caso estoy acostumbrado a manejarlo de esta manera, me parece interesante y técnica a la vez.
 */

@Injectable()
export abstract class RequestService {
  protected toastService = inject(ToastService);
  private readonly _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  protected executeRequest<T>(source$: Observable<T>,
    operationType = OperationType.QUERY,
    customMessages?: { success?: string; error?: string },
  ): Observable<T> {
    this.start();
    return source$.pipe(
      tap({
        next: () => {
          if (operationType !== OperationType.QUERY) {
            const message = customMessages?.success || this.getDefaultMessage(operationType);
            this.toastService.showToast(message);
          }
        },
        error: (error: any) => {
          this.toastService.showToast(this.getErrorMessage(error));
        }
      }),
      finalize(() => this.stop())
    );
  }

  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }

    return 'Ha ocurrido un error inesperado';
  }

  private getDefaultMessage(operation: OperationType): string {
    const messages = {
      [OperationType.CREATE]: 'Elemento creado exitosamente',
      [OperationType.UPDATE]: 'Elemento actualizado exitosamente',
      [OperationType.DELETE]: 'Elemento eliminado exitosamente',
      [OperationType.QUERY]: ''
    };
    return messages[operation];
  }

  protected query<T>(source$: Observable<T>): Observable<T> {
    return this.executeRequest(source$, OperationType.QUERY);
  }

  protected create<T>(source$: Observable<T>, entity: string): Observable<T> {
    return this.executeRequest(source$, OperationType.CREATE, { success: `${entity} creado exitosamente` });
  }

  protected update<T>(source$: Observable<T>, entity: string): Observable<T> {
    return this.executeRequest(source$, OperationType.UPDATE, { success: `${entity} actualizado exitosamente` });
  }

  protected delete<T>(source$: Observable<T>, entity: string): Observable<T> {
    return this.executeRequest(source$, OperationType.DELETE, { success: `${entity} eliminado exitosamente` });
  }

  private start(): void {
    this._loading.next(true);
  }

  private stop(): void {
    this._loading.next(false);
  }

}

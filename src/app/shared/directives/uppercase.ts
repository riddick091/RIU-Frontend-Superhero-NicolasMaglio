import { Directive, ElementRef, HostListener, inject } from "@angular/core";

@Directive({
    selector: '[appUppercase]'
})
export class UppercaseDirective {
    private el = inject(ElementRef);

    ngOnInit(): void {
        this.convertToUppercase()
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.convertToUppercase()
        }, 0);
    }

    @HostListener('input', ['$event'])
    onInput(event: any): void {
        this.handleInputChange(event)
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: any): void {
        this.handleInputChange(event)
    }

    @HostListener('ngModelChange')
    onModelChange(): void {
        setTimeout(() => {
            this.convertToUppercase();
        }, 0);
    }

    private handleInputChange(event: any): void {
        const input = event.target;
        const start = input.selectionStart;
        const end = input.selectionEnd;

        const upperValue = input.value.toUpperCase()
        if (input.value !== upperValue) {
            input.value = upperValue;

            input.setSelectionRange(start, end);

            input.dispatchEvent(new Event('input', { bubbles: true }))
        }
    }

    private convertToUppercase(): void {
        const input = this.el.nativeElement
        if (input && input.value) {
            const upperValue = input.value.toUpperCase();
            if (input.value !== upperValue) {
                input.value = upperValue
                input.dispatchEvent(new Event('input', { bubbles: true }))
            }
        }
    }
}
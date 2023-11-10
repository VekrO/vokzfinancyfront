import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  @Input() tooltip: string = '';

  private tooltipElement: HTMLDivElement = document.createElement("div");

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.initializeTooltipStyles();
  }

  private initializeTooltipStyles() {
    // Defina os estilos do tooltip aqui
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1');
    this.renderer.setStyle(this.tooltipElement, 'background-color', '#333');
    this.renderer.setStyle(this.tooltipElement, 'border', '1px solid #666');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '5px');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');

    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'help');
    this.renderer.setStyle(this.tooltipElement, 'display', 'block');
    const element = this.el.nativeElement;
    const elementRect = element.getBoundingClientRect();
    const top = elementRect.bottom + 5; // Ajuste a posição vertical conforme necessário
    const left = elementRect.left; // Ajuste a posição horizontal conforme necessário

    this.renderer.setStyle(this.tooltipElement, 'top', top + 'px');
    this.renderer.setStyle(this.tooltipElement, 'left', left + 'px');

    this.tooltipElement.innerText = this.tooltip;
  }

  private hideTooltip() {
    this.renderer.setStyle(this.el.nativeElement, 'color', 'black');
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
  }
}

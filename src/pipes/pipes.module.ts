import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse/reverse';
@NgModule({
	declarations: [ReversePipe],
	imports: [],
	exports: [ReversePipe]
})
export class PipesModule {}

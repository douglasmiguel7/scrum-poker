import { TestBed } from '@angular/core/testing'
import { TableComponent } from './table.component'

describe('TableComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TableComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have the 'scrum-poker' title`, () => {
    const fixture = TestBed.createComponent(TableComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('scrum-poker')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(TableComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, scrum-poker',
    )
  })
})

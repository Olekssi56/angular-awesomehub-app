import { Observable } from 'rxjs/Observable';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PrimaryRouteComponent } from '../../../core';
import { ListsConfig } from '../../lists.config';
import { RecordsetFactoryService, RecordsetService, Recordset } from '../../../recordsets';
import { ListCollection, ListSummary } from '../../state';

@Component({
  template: `
    <content transparent="true" layout="compact">
      <h3 class="content-heading">Browse Lists</h3>
      <lists
        [recordset]="recordset$ | async"
        (needMore)="recordset.paginate()">
      </lists>
    </content>
`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeRouteComponent extends PrimaryRouteComponent implements OnInit, OnDestroy {
  public title = 'Home';
  public recordset: RecordsetService<ListSummary>;
  public recordset$: Observable<Recordset<ListSummary>>;

  constructor(private route: ActivatedRoute, private recordsetFactory: RecordsetFactoryService) {
    super();
  }

  ngOnInit() {
    // Get the resolved collection
    let collection: ListCollection = this.route.snapshot.data['collection'];

    // Create the lists recordset
    this.recordset = this.recordsetFactory.create('browse-lists', ListsConfig.LIST_SUMMARY_RECORDSET, {
      parent: collection.id,
      size: ListsConfig.LISTS_PER_PAGE
    });

    // Fetch the recordset observable
    this.recordset$ = this.recordset.fetch();
  }

  ngOnDestroy() {
    this.recordsetFactory.destroy('browse-lists');
  }
}

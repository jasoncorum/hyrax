export default class {
  constructor() {
    this.collections_table = $('#analytics-collections-table');
    this.works_table = $('#analytics-works-table');
    this.admin_repo_charts = $('.admin-repo-charts');

    this.createDataTables();
    this.transitionChart();
  }

  createDataTables() {
    this.collections_table.DataTable();

    // Uses server side sorting, etc. Generally there will be way too many works to show them in one go
    let analytics_works = this.works_table.DataTable({
      ajax: {
        url: '/analytics/update_works_list',
        error: function (jqXHR, textStatus, errorThrown) {
          alert(errorThrown);
        }
      },
      language: {
        processing: '<img src="/assets/sm-loader.gif">'
      },
      search: {
        search: (val) => {
          if (val >= 3) {
            return  val;
          }

          return '';
        }
      },
      searchDelay: 350,
      processing: true,
      serverSide: true
    });

    this.minTableSearchLength('analytics-works-table', analytics_works);
  }

  /**
   * Add minimum typeahead length for dataTable filter searching
   * See https://stackoverflow.com/questions/5548893/jquery-datatables-delay-search-until-3-characters-been-typed-or-a-button-clicke/23897722#23897722
   * @param selector
   * @param table_obj
   */
  minTableSearchLength(selector, table_obj) {
    $('#' + selector + '_filter input')
      .unbind()
      .bind('input', function(e) {
        let search_value = this.value;

        if (search_value.length >= 3) {
          table_obj.search(search_value).draw();
        }

        if(search_value === '') {
          table_obj.search('').draw();
        }
      });
  }

  /**
   * Update CSS for clicked charts toggling
   */
  transitionChart() {
    this.admin_repo_charts.on('click', (e) => {
      let type_id = e.target.id;
      let field = $('#' + type_id);

      $(field).on('ajax:success', (e, data) => {
        let update_chart_id = (/days/.test(type_id)) ? 'dashboard-growth' : 'dashboard-repository-objects';
        this.updateChart(update_chart_id, data);

        let clicked_chart = field.parents().filter('ul').attr('id');
        $('#' + clicked_chart + ' a').removeClass('stats-selected');
        field.addClass('stats-selected');
      })
    });
  }

  /**
   * Update a chart based on the clicked parameter
   * @param id
   * @param data
   */
  updateChart(id, data) {
    let chart = Chartkick.charts[id];
    chart.updateData(data);
  }
}
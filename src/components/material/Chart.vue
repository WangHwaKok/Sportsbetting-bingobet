<script>
import { Bar, mixins } from 'vue-chartjs'
export default {
    extends: Bar,
    props: {
        chartdata: {
            type: Object,
            default: null
        },
    },
    data: () => ({
        // chartdata: {
        //     labels: ["2015-01", "2015-02", "2015-03"],
        //     datasets: [{
        //         label: '# of Tomatoes',
        //         data: [12, 19, 3],
        //     }]
        // },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
                display: false,
                text: 'Predicted world population (millions) in 2050'
            }
        }
    }),

    mounted () {
        this.renderChart(this.chartdata, this.options)
    }
}
</script>
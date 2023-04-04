import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { ShopService } from 'src/app/shared/service/shop.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/tables/product';
import { Order } from 'src/app/shared/tables/order-list';
import { OrderService } from 'src/app/shared/service/order.service';
import { resolve } from 'path';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    //Log-in
    isShop: boolean = false;
    loggedId: number = Number(localStorage.getItem('user-id'))
    loggedRole = localStorage.getItem('user-role');
    shopId: number;

    //Shop Properties
    totalRevenue: number = 0;
    totalProducts: number = 0;
    totalReviewCount: number = 0;
    totalAverageRating: number = 0;

    //Orders
    orders: Order[] = [];

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 5;
    sortBy = "orderTime";
    sortDir = "desc";
    theTotalElements = 0;

    constructor(
        private shopService: ShopService,
        private productService: ProductService,
        private orderService: OrderService,
    ) {
        Object.assign(this, { doughnutData, pieData });
    }


    ngOnInit() {
        if (this.loggedRole != 'ROLE_ADMIN') {
            this.isShop = true;
            // this.shopId = Number(localStorage.getItem('shop-id'))

            const shopIdPromise = new Promise<number>((resolve) => {
                const shopId = Number(localStorage.getItem('shop-id'));
                resolve(shopId);
            })

            shopIdPromise.then((shopId) => {
                this.shopId = shopId;
                console.log(shopId);

                this.productService.getProductsByShopIdNoPageable(this.shopId).subscribe((products) => {
                    let i = 0;
                    products.forEach(product => {
                        this.totalReviewCount = this.totalReviewCount + product.reviewCount;
                        this.totalProducts = this.totalProducts + product.sold;
                        if (product.averageRating != 0) {
                            this.totalAverageRating = this.totalAverageRating + product.averageRating;
                            i++;
                        }
                    });
                    this.totalAverageRating = this.totalAverageRating / i;
                })

                this.orderService.getOrdersByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
                    .subscribe(this.processResult());
                this.shopService.getShopRevenue(this.shopId, 30).subscribe((res) => {
                    this.totalRevenue = res;
                });
            })
        }
        else {
            //ADMIN DO HERE
            this.orderService
                .getOrdersPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
                .subscribe(this.processResult());
        }
    }

    processResult() {
        return (data: any) => {
            this.orders = data.orders;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        };
    }

    public doughnutData = doughnutData;
    public pieData = pieData;



    // doughnut 2
    public view = chartData.view;
    public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
    public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
    public doughnutChartGradient = chartData.doughnutChartGradient;
    public doughnutChartTooltip = chartData.doughnutChartTooltip;

    public chart5 = chartData.chart5;


    // lineChart
    public lineChartData = chartData.lineChartData;
    public lineChartLabels = chartData.lineChartLabels;
    public lineChartOptions = chartData.lineChartOptions;
    public lineChartColors = chartData.lineChartColors;
    public lineChartLegend = chartData.lineChartLegend;
    public lineChartType = chartData.lineChartType;

    // lineChart
    public smallLineChartData = chartData.smallLineChartData;
    public smallLineChartLabels = chartData.smallLineChartLabels;
    public smallLineChartOptions = chartData.smallLineChartOptions;
    public smallLineChartLegend = chartData.smallLineChartLegend;
    public smallLineChartType = chartData.smallLineChartType;

    // lineChart
    public smallLine2ChartData = chartData.smallLine2ChartData;
    public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
    public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
    public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
    public smallLine2ChartType = chartData.smallLine2ChartType;

    // lineChart
    public smallLine3ChartData = chartData.smallLine3ChartData;
    public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
    public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
    public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
    public smallLine3ChartType = chartData.smallLine3ChartType;

    // lineChart
    public smallLine4ChartData = chartData.smallLine4ChartData;
    public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
    public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
    public smallLine4ChartColors = chartData.smallLine4ChartColors;
    public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
    public smallLine4ChartType = chartData.smallLine4ChartType;

    public chart3 = chartData.chart3;


    // events
    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }



    ngAfterViewInit(): void {
    }


}

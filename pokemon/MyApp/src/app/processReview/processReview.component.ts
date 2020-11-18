import { Component, OnInit } from "@angular/core";
import { RdfDataService } from "../services/rdf-data.service";

@Component({
  selector: "app-processReview",
  templateUrl: "./processReview.component.html",
  styleUrls: ["./processReview.component.css"],
})
export class ProcessReviewComponent implements OnInit {
  // util
  keys = Object.keys;
  _loaderShow: boolean = false;

  // legend data
  valueOK: number = 1;
  valueWarning: number = 5;

  // dropdown selection
  selectedMachine: string;
  selectedType: string;
  selectedType2: string;
  selectedProcess: string;
  selectOrderNumber: string;
  deg: string;

  // dropdown data
  machines: Array<string>;
  types: Array<string>;
  processes: Array<string>;
  orderNumbers: Array<Object> = [];
  attacks: Array<Object> = [];
  maxDam: Array<Object> = [];
  degT: Array<Object> = [];

  // process data table
  processDataTable: Array<Object> = [];
  message: string;

  t1: boolean = false;
  t2: boolean = false;
  t3: boolean = false;
  t4: boolean = false;

  constructor(private dataService: RdfDataService) {}

  ngOnInit() {
    this.dataService.getDressur().subscribe((data: any) => {
      this.machines = data;
      console.log(this.machines);
    });
    this.dataService.getType().subscribe((data: any) => {
      this.types = data;
      console.log(this.types);
    });
  }

  getOrderNumber(selectedMachine: string) {
    if (selectedMachine) {
      this.t1 = true;
      this.t2 = false;
      this.t3 = false;
      this.t4 = false;
      this.dataService.getPoks(selectedMachine).subscribe((data: any) => {
        this.orderNumbers = data;
        console.log(this.orderNumbers);
      });
    }
  }

  getAttacks(selectedType: string) {
    if (selectedType) {
      this.t1 = false;
      this.t2 = true;
      this.t3 = false;
      this.t4 = false;
      this.dataService.getAttacks(selectedType).subscribe((data: any) => {
        this.attacks = data;
        console.log(this.attacks);
      });
    }
  }
  getDeg(deg: number) {
    if (deg) {
      this.t1 = false;
      this.t2 = false;
      this.t3 = false;
      this.t4 = true;
      this.dataService.getDeg(deg).subscribe((data: any) => {
        this.degT = data;
        console.log(this.degT);
      });
    }
  }
  getMaxDam(selectedType2: string) {
    if (selectedType2) {
      this.t1 = false;
      this.t2 = false;
      this.t3 = true;
      this.t4 = false;
      this.dataService.getMaxDam(selectedType2).subscribe((data: any) => {
        this.maxDam = data;
        console.log(this.maxDam);
      });
    }
  }

  getProcesses(selectedMachine: string, selectOrderNumber: string) {
    if (selectedMachine && selectOrderNumber) {
      this.dataService
        .getProcesses(selectedMachine, selectOrderNumber)
        .subscribe((data: any) => {
          this.processes = data;
        });
    }
  }

  getProcessData(selectedProcess: string) {
    if (selectedProcess) {
      this._loaderShow = true;
      this.dataService
        .getProcessData(selectedProcess)
        .subscribe((data: any) => {
          this._loaderShow = false;
          if (data.length != 0) {
            this.processDataTable = data;
            // this.processDataTable = this.checkData(this.processDataTable);
            console.log(this.processDataTable);
            this.message = undefined;
          } else {
            this.message = "There is no process data available.";
          }
        });
    }
  }

  checkData(table) {
    console.log("working");
    for (let row = 0; row < table.length; row++) {
      let nominalTemp = table[row].NominalTemperatureHC1Value;
      let actualTemp = table[row].ActualTemperatureHC1Value;
      let nominalPressure = table[row].NominalPressureValue;
      let actualPressure = table[row].ActualPressureValue;

      if (nominalTemp == 0 || actualTemp == 0) {
        table[row].TemperatureCheck = "-";
      } else if (Math.abs(1 - nominalTemp / actualTemp) * 100 <= this.valueOK) {
        table[row].TemperatureCheck = "ok";
      } else if (
        Math.abs(1 - nominalTemp / actualTemp) * 100 <=
        this.valueWarning
      ) {
        table[row].TemperatureCheck = "warning";
      } else {
        table[row].TemperatureCheck = "alert";
      }
      if (nominalPressure == 0 || actualPressure == 0) {
        table[row].PressureCheck = "-";
      } else if (
        Math.abs(1 - nominalPressure / actualPressure) * 100 <=
        this.valueOK
      ) {
        table[row].PressureCheck = "ok";
      } else if (
        Math.abs(1 - nominalPressure / actualPressure) * 100 <=
        this.valueWarning
      ) {
        table[row].PressureCheck = "warning";
      } else {
        table[row].PressureCheck = "alert";
      }
    }
    return table;
  }
}

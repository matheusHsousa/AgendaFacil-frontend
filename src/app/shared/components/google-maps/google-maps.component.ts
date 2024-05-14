import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogDetailsComponent } from '../dialog-details/dialog-details.component';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @ViewChild('addressInput', { static: true }) addressInput!: ElementRef;

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  lat: any;
  lng: any;

  constructor(
    private zone: NgZone,
    private dialogDetailsComponent: DialogDetailsComponent
  ) {
    this.dialogDetailsComponent.getLocal().then((locationData) => {
      this.lat = locationData.latitude;
      this.lng = locationData.longitude;
    });
  }

  defaultCenter!: google.maps.LatLngLiteral;

  ngOnInit() {
    this.dialogDetailsComponent.getLocal().then((locationData) => {
      this.lat = locationData.latitude;
      this.lng = locationData.longitude;

      this.defaultCenter = {
        lat: this.lat,
        lng: this.lng,
      };

      this.initializeMap();
    });
  }

  private initializeMap() {
    this.zone.runOutsideAngular(() => {
      const mapOptions: google.maps.MapOptions = {
        center: this.defaultCenter,
        zoom: 17,
      };

      this.map = new google.maps.Map(
        this.mapContainer.nativeElement,
        mapOptions
      );
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
      });

      // Adiciona um marcador para a localização exata
      const centerMarker = new google.maps.Marker({
        position: this.defaultCenter,
        map: this.map,
        title: 'Localização Exata',
      });
    });
  }

  private calculateAndDisplayRoute(destination: google.maps.LatLngLiteral) {
    this.directionsService.route(
      {
        origin: this.defaultCenter,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          this.directionsRenderer.setDirections(response);

          const destinationMarker = new google.maps.Marker({
            position: destination,
            map: this.map,
            title: 'Destino',
          });
        } else {
          console.error('Não foi possível calcular o percurso.');
        }
      }
    );
  }

  updateMarkerPosition(latitude: number, longitude: number): void {
    const newPosition: google.maps.LatLngLiteral = {
      lat: latitude,
      lng: longitude,
    };
    this.marker.setPosition(newPosition);
    this.map.setCenter(newPosition);
  }
}

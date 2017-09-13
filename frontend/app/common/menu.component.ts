import { Component } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { AuthService } from '../service/auth.service';

// https://slideout.js.org/
const Slideout = require('slideout');

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
    private slideoutLeft;
    private slideoutRight;
    private profilePictureUrl: string;

    constructor(private auth: AuthService, private toasterService: ToasterService) { }

    /**
     * logout() function
     */
    logout(): void {
        this.slideoutRight.toggle();
        this.auth.logout();
    }

    /**
     * editProfile() function
     */
    editProfile(): void {
        this.slideoutRight.toggle();
        this.toasterService.pop('warning', 'No Disponible');
    }

    /**
     * toggle() function
     */
    toggle(side): void {
        if (side === 'right') {
            this.slideoutRight.toggle();
        } else if (side === 'left') {
            this.slideoutLeft.toggle();
        }
    }

    ngOnInit(): void {
        let _this = this;
        let menuLeft = document.getElementById('menu-left'),
            menuRight = document.getElementById('menu-right'),
            padding = 256;
        this.slideoutLeft = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu-left'),
            'padding': padding,
            'tolerance': 70,
            'side': 'left'
        }).on('beforeopen', function() {
            menuRight.style.transform = "translateX(" + padding + "px)";
        }).on('beforeclose', function() {
            menuLeft.style.visibility = "hidden";
        }).on('close', function() {
            menuRight.style.transform = "translateX(0px)";
            menuLeft.style.visibility = "visible";
        });
        // Toggle button
        document.querySelector('.toggle-button').addEventListener('click', function() {
            _this.slideoutLeft.toggle();
        });

        this.slideoutRight = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': menuRight,
            'padding': 256,
            'tolerance': 70,
            'side': 'right'
        }).on('beforeopen', function() {
            menuLeft.style.transform = "translateX(-" + padding + "px)";
        }).on('beforeclose', function() {
            menuRight.style.visibility = "hidden";
        }).on('close', function() {
            menuLeft.style.transform = "translateX(0px)";
            menuRight.style.visibility = "visible";
        });

        // Toggle button
        document.querySelector('.toggle-button-right').addEventListener('click', function() {
            _this.slideoutRight.toggle();
        });

        this.profilePictureUrl = this.auth.profilePictureUrl;
    }
}

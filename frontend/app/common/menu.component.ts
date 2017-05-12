import { Component } from '@angular/core';

// https://slideout.js.org/
const Slideout = require('slideout');

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
    ngOnInit(): void {
        let menuRight = document.getElementById('menu-right'),
            padding = 256;
        var slideoutLeft = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu-left'),
            'padding': padding,
            'tolerance': 70,
            'side': 'left'
        }).on('beforeopen', function() {
            menuRight.style.transform = "translateX(" + padding + "px)";
        }).on('beforeclose', function() {
            menuRight.style.transform = "translateX(0px)";
        });
        // Toggle button
        document.querySelector('.toggle-button').addEventListener('click', function() {
            slideoutLeft.toggle();
        });

        var slideoutRight = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': menuRight,
            'padding': 256,
            'tolerance': 70,
            'side': 'right'
        });
        // Toggle button
        document.querySelector('.toggle-button-right').addEventListener('click', function() {
            slideoutRight.toggle();
        });
    }
}

BlurSwapper
===========

jQuery plugin to turn a list into a rotating text madness machine

## Demo

[Demo on jsFiddle](http://jsfiddle.net/andrewray/zQ9ye/3/)

## Usage

Suggested markup:

    <ul id="swapper" class="swapper">
        <li>I am entry one</li>
        <li>This is a second entry</li>
        <li>I'm a third entry</li>
    </ul>

Suggested CSS:

    .swapper {
        list-style:none;
        width:100px;
        height:20px;
        position:relative;
    }
    .swapper > li {
        position:absolute;
    }

Then DO IT

    $('#swapper').blurSwap(options).startSwapping();

## Options

direction:

    The direction the text moves in and out. One of 'up' 'down' 'left'
    or 'right'
    
inMoveDist:

    How far the text will move when appearing

outMoveDist:

    How far the text will move when disappearing

duration:

    How long the switching animation lasts

delay:

    How long to wait before showing the next item

blurred:

    Whether or not to show motion blur on the text (boolean)

windSpeed:

    How far each blurred element should be (pixels)

## Methods

$().blurSwap

    Turn this bad boy into a blur swapper

$().startSwapping

    Do it!

$().stopSwapping

    Stop it!

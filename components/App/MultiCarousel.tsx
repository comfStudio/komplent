import React, { useState, useEffect, memo } from 'react';
import { Carousel, Grid, Col, Row, Panel } from 'rsuite';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import Image from '@components/App/Image'
import { HTMLElementProps, ReactProps } from '@utility/props';

interface MultiCarouselProps extends HTMLElementProps, ReactProps {
    naturalSlideWidth: number
    naturalSlideHeight: number
    step?: number
    visibleSlides?: number
    keyFunc?: (child: any, index: number) => any
}

const MultiCarousel = memo(function MultiCarousel({keyFunc = (child, idx) => idx, ...props}: MultiCarouselProps) {

    const [count, set_count] = useState(0)

    useEffect(() => {
        set_count(React.Children.count(props.children))
    }, [props.children])

    return (
        <CarouselProvider
              naturalSlideWidth={props.naturalSlideWidth}
              naturalSlideHeight={props.naturalSlideHeight}
              totalSlides={count}
              visibleSlides={props.visibleSlides}
              step={props.step}
            >
              <Slider>
                  {React.Children.map(props.children, (child, idx) => (
                  <Slide key={keyFunc(child, idx)} index={idx}>
                      <div className="flex content-center justify-center h-full">
                          <div className="self-center">
                              {child}
                          </div>
                        </div>
                    </Slide>
                    ))
                    }
              </Slider>
        </CarouselProvider>
    );
})

export default MultiCarousel;
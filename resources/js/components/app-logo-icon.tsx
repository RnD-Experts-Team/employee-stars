import type { SVGAttributes } from 'react';

/**
 * PNE Stars logo glyph — a pizza wedge with a star, drawn in
 * single-color fill so it inherits the host text color.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 2C9.507 2 1 10.507 1 21c0 .69.038 1.371.11 2.04a1.5 1.5 0 0 0 1.65 1.32 1.7 1.7 0 0 1 1.787 2.02 1.5 1.5 0 0 0 1.045 1.762C13.62 30.41 20 30.41 20 30.41s6.38 0 14.408-2.268a1.5 1.5 0 0 0 1.045-1.762 1.7 1.7 0 0 1 1.787-2.02 1.5 1.5 0 0 0 1.65-1.32c.072-.669.11-1.35.11-2.04C39 10.507 30.493 2 20 2Zm0 32.5c-3.59 0-7.13-.547-10.46-1.61a1.5 1.5 0 0 0-1.92 1.42v.95A1.74 1.74 0 0 0 9.36 37h21.28a1.74 1.74 0 0 0 1.74-1.74v-.95a1.5 1.5 0 0 0-1.92-1.42c-3.33 1.063-6.87 1.61-10.46 1.61Zm-7.5-17.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm9 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm6.5-3a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
            />
        </svg>
    );
}

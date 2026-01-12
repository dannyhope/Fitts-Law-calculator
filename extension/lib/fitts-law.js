/**
 * Fitts' Law calculation library
 * Implements Shannon's formulation for predicting target acquisition time
 *
 * @module FittsLaw
 */

const FittsLaw = (() => {
    'use strict';

    /**
     * Configuration constants for Fitts' Law calculations
     */
    const CONFIG = {
        // Shannon formulation constants
        FITTS_LAW_A: 0, // Starting time constant (ms)
        FITTS_LAW_B: 150, // Slope constant (ms per bit)

        // Safety constants
        MIN_WIDTH: 0.1, // Minimum width to prevent division by zero
        EPSILON: 0.0001 // Threshold for avoiding division by zero
    };

    /**
     * Calculate Euclidean distance between two points in 2D space
     * @param {number} x1 - X coordinate of first point
     * @param {number} y1 - Y coordinate of first point
     * @param {number} x2 - X coordinate of second point
     * @param {number} y2 - Y coordinate of second point
     * @returns {number} Distance between the two points
     */
    function calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Find intersection points between a line segment and a rectangle
     *
     * Uses parametric line equation: P(t) = P1 + t(P2 - P1) where t ∈ [0, 1]
     *
     * @param {number} x1 - X coordinate of line start
     * @param {number} y1 - Y coordinate of line start
     * @param {number} x2 - X coordinate of line end
     * @param {number} y2 - Y coordinate of line end
     * @param {DOMRect} rect - Rectangle with left, right, top, bottom
     * @returns {Array<{x: number, y: number, t: number}>} Intersection points with t parameter
     */
    function lineRectangleIntersection(x1, y1, x2, y2, rect) {
        const intersections = [];
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Top and bottom edges (if line is not horizontal)
        if (Math.abs(dy) > CONFIG.EPSILON) {
            let t = (rect.top - y1) / dy;
            if (t >= 0 && t <= 1) {
                const x = x1 + t * dx;
                if (x >= rect.left && x <= rect.right) {
                    intersections.push({ x, y: rect.top, t });
                }
            }

            t = (rect.bottom - y1) / dy;
            if (t >= 0 && t <= 1) {
                const x = x1 + t * dx;
                if (x >= rect.left && x <= rect.right) {
                    intersections.push({ x, y: rect.bottom, t });
                }
            }
        }

        // Left and right edges (if line is not vertical)
        if (Math.abs(dx) > CONFIG.EPSILON) {
            let t = (rect.left - x1) / dx;
            if (t >= 0 && t <= 1) {
                const y = y1 + t * dy;
                if (y >= rect.top && y <= rect.bottom) {
                    intersections.push({ x: rect.left, y, t });
                }
            }

            t = (rect.right - x1) / dx;
            if (t >= 0 && t <= 1) {
                const y = y1 + t * dy;
                if (y >= rect.top && y <= rect.bottom) {
                    intersections.push({ x: rect.right, y, t });
                }
            }
        }

        return intersections;
    }

    /**
     * Calculate Fitts' Law metrics for target acquisition
     *
     * Shannon's formulation: MT = a + b × log₂(D/W + 1)
     * Where:
     * - MT = Movement Time
     * - D = Distance to entry point
     * - W = Effective Width (overlap through target)
     * - ID = Index of Difficulty = log₂(D/W + 1)
     *
     * @param {number} mouseX - Current mouse X position
     * @param {number} mouseY - Current mouse Y position
     * @param {DOMRect} targetRect - Bounding rectangle of target element
     * @returns {Object|null} Metrics object with time, distance, width, id, isInside
     */
    function calculateMetrics(mouseX, mouseY, targetRect) {
        if (!targetRect) {
            return null;
        }

        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;

        // Check if mouse is inside the target
        const isInside =
            mouseX >= targetRect.left &&
            mouseX <= targetRect.right &&
            mouseY >= targetRect.top &&
            mouseY <= targetRect.bottom;

        let distance, effectiveWidth;

        if (isInside) {
            // Already inside - target acquired
            distance = 0;
            const intersections = lineRectangleIntersection(
                mouseX,
                mouseY,
                centerX,
                centerY,
                targetRect
            );

            if (intersections.length > 0) {
                const exitPoint = intersections.reduce(
                    (max, p) => (p.t > max.t ? p : max),
                    intersections[0]
                );
                effectiveWidth = calculateDistance(mouseX, mouseY, exitPoint.x, exitPoint.y);
            } else {
                effectiveWidth = CONFIG.MIN_WIDTH;
            }
        } else {
            // Outside - find entry point
            const intersections = lineRectangleIntersection(
                mouseX,
                mouseY,
                centerX,
                centerY,
                targetRect
            );

            if (intersections.length >= 1) {
                intersections.sort((a, b) => a.t - b.t);
                const entryPoint = intersections[0];

                distance = calculateDistance(mouseX, mouseY, entryPoint.x, entryPoint.y);
                effectiveWidth = calculateDistance(entryPoint.x, entryPoint.y, centerX, centerY);
            } else {
                distance = calculateDistance(mouseX, mouseY, centerX, centerY);
                effectiveWidth = CONFIG.MIN_WIDTH;
            }
        }

        // Ensure minimum width
        effectiveWidth = Math.max(effectiveWidth, CONFIG.MIN_WIDTH);

        // Shannon formulation
        const indexOfDifficulty = Math.log2(distance / effectiveWidth + 1);
        const movementTime = CONFIG.FITTS_LAW_A + CONFIG.FITTS_LAW_B * indexOfDifficulty;

        return {
            time: movementTime,
            distance: distance,
            width: effectiveWidth,
            ratio: distance / effectiveWidth,
            id: indexOfDifficulty,
            isInside: isInside
        };
    }

    // Public API
    return {
        calculateMetrics,
        CONFIG
    };
})();

// Export for use in extension
if (typeof window !== 'undefined') {
    window.FittsLaw = FittsLaw;
}

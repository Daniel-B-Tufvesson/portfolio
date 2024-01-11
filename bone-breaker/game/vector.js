/**
 * A 2D vector for simplifying the vector space calculations.
 */
export class Vector {
    constructor(x, y) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    set(v) {
        this.x = v.x
        this.y = v.y
        return this
    }


    setXY(x, y) {
        this.x = x
        this.y = y
        return this
    }

    /**
     * Compute the length of this vector.
     */
    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Return the normalized vector.
     */
    normed() {
        const l = this.len() + 0.00001; // epsilon to prevent division by zero.
        return new Vector(this.x / l, this.y / l);
    }

    /**
     * Return a scaled version of this vector.
     */
    scaled(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    /**
     * Return a rotated vector around the origin.
     */
    rotated(rotationRad) {
        const sin = Math.sin(rotationRad);
        const cos = Math.cos(rotationRad);
        return new Vector(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    /**
     * Rotate this vector around the origin.
     * @param {number} rotationRad 
     */
    rotate(rotationRad) {
        const sin = Math.sin(rotationRad);
        const cos = Math.cos(rotationRad);
        const newX = this.x * cos - this.y * sin
        this.y = this.x * sin + this.y * cos
        this.x = newX
        return this
    } 

    /**
     * Compute the dot product of this vector and another.
     */
    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y
    }


    /**
     * Compute the distance from this vector to the given position.
     */
    dist(x, y) {
        const dx = this.x - x
        const dy = this.y - y
        return Math.sqrt(dx*dx + dy*dy)
    }

}

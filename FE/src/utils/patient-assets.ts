const getDeterministicRandom = (id: string, min: number, max: number): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % (max - min + 1);
    return min + index;
};
export function resolvePatientAvatar(img: string, id: string, age: number, gender: string): string {
    if (img && img.startsWith('http') && !img.includes('VP7.jpeg') && !img.includes('example.com')) {
        return img;
    }
    if (img && img.startsWith('/images') && !img.includes('VP7.jpeg')) {
        return img;
    }
    return getAvatarByAge(id, age, gender);
}

export const getAvatarByAge = (id: string, age: number, gender: string = "FEMALE"): string => {
    const g = gender.toUpperCase();
    let vpNumber: number;

    // 1. Trẻ em < 12 tuổi
    if (age < 12) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 15, 19); // MALE < 12: VP15-19
        } else {
            vpNumber = getDeterministicRandom(id, 19, 23); // FEMALE < 12: VP19-23
        }
    } 
    // 2. Thanh niên <= 30 tuổi
    else if (age <= 30) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 3, 9);   // MALE <= 30: VP3-9
        } else {
            vpNumber = getDeterministicRandom(id, 10, 14); // FEMALE <= 30: VP10-14
        }
    }
    // 3. Trung niên 31 - 55 tuổi
    else if (age <= 55) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 32, 36); // MALE 31-55: VP32-36
        } else {
            vpNumber = getDeterministicRandom(id, 37, 41); // FEMALE 31-55: VP37-41
        }
    }
    // 4. Người già > 55 tuổi
    else {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 28, 31); // MALE > 55: VP28-31
        } else {
            // FEMALE > 55: VP1 và VP24-27
            const pool = [1, 24, 25, 26, 27];
            const randomIndex = getDeterministicRandom(id, 0, pool.length - 1);
            vpNumber = pool[randomIndex];
        }
    }

    const extension = vpNumber <= 10 ? 'jpeg' : 'jpg';

    return `/images/VirtualPatient/VP${vpNumber}.${extension}`;
};
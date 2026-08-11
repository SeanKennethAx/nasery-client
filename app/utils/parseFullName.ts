export function parseFullName(fullName: string) {
    const parts = fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) {
        return {
            firstname: '',
            middlename: '',
            lastname: '',
        }
    }

    if (parts.length === 1) {
        return {
            firstname: parts[0] ?? '',
            middlename: '',
            lastname: '',
        }
    }

    if (parts.length === 2) {
        return {
            firstname: parts[0] ?? '',
            middlename: '',
            lastname: parts[1] ?? '',
        }
    }

    return {
        firstname: parts[0] ?? '',
        middlename: parts
            .slice(1, -1)
            .join(' '),
        lastname: parts[parts.length - 1] ?? '',
    }
}
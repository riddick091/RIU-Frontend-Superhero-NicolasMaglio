export const HERO_ROUTES = {
    NEW_HERO: 'heros/new',
    EDIT_HERO: 'heros/:id/edit'
} as const

export const MENU_ROUTES = {
    DASHBOARD: 'dashboard',
    HEROES: 'heros',
    LOGIN: '/auth/login'
} as const
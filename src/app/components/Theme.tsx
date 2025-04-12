"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const Theme = () => {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const defaultTheme = 'corporate';

    useEffect(() => {
        if (!theme) {
            setTheme(defaultTheme);
        }
    }, [theme, setTheme]);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    return (
        <div className='flex items-center justify-center'>
            <select className="select select-accent w-36" value={theme} onChange={e => setTheme(e.target.value)}>
                <option selected disabled>Theme</option>
                <option value="corporate">Default</option>
                <option value="system">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="coffee">Coffee</option>
                <option value="luxury">Luxury</option>
                <option value="autumn">Autumn</option>
                <option value="corporate">Corporate</option>
                <option value="halloween">Halloween</option>
                <option value="valentine">Valentine</option>
                <option value="garden">Garden</option>
                <option value="forest">Forest</option>
                <option value="fantasy">Fantasy</option>
                <option value="business">Business</option>
                <option value="dracula">Dracula</option>
                <option value="black">Black</option>
                <option value="lemonade">Lemonade</option>
                <option value="night">Night</option>
                <option value="winter">Winter</option>
                <option value="sunset">Sunset</option>
                <option value="nord">Nord</option>
            </select>
        </div>
    )
}

export default Theme
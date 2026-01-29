import type { AnchorHTMLAttributes, ReactNode } from 'react'


type ButtonProps = {
    url: string
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>

export default function Button({ url, children, className, download, ...props }: ButtonProps) {
    return <a
      href={url}
      className={className}
      download={download ? true : undefined}
      {...props}
    >
      {children}
    </a>
}
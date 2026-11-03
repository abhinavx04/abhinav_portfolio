"use client";

import { useRef } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";

/**
 * Phone menu: a native modal <dialog>, which gives focus trapping, Esc to close and an inert
 * page behind it for free. Full-screen solid black, large links.
 */
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className="press -mr-2 grid size-11 place-items-center"
      >
        <Menu aria-hidden="true" className="size-6" strokeWidth={2.25} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-label="Menu"
        className="mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-text"
        // Tapping a link closes the menu, then the browser follows the hash.
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close();
        }}
      >
        <div className="container-site flex h-[var(--bar-h)] items-center justify-between">
          <span className="text-[1.0625rem] font-black uppercase leading-none tracking-[-0.02em]">
            {site.shortName}
          </span>
          <button
            type="button"
            onClick={close}
            className="press -mr-2 grid size-11 place-items-center"
            autoFocus
          >
            <X aria-hidden="true" className="size-6" strokeWidth={2.25} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className="container-site pt-12">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="press block py-2 text-display font-black uppercase"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-8">
              <a
                href={site.links.resume}
                className="press inline-block rounded-ui bg-orange px-6 py-3.5 text-body font-semibold text-on-orange"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </dialog>
    </div>
  );
}

<script lang="ts">
  import { untrack } from 'svelte';
  import { inFolder, projectIcon, type ProjectData } from '../../items';
  import AppIcon from '../../shell/AppIcon.svelte';
  import { dispatch } from '../../stores/os-actions';
  import ProjectDetail from './ProjectDetail.svelte';
  import { projectsForRole, roleFilters, type RoleFilter } from './projects-view';

  interface Props {
    projects: ProjectData[];
    /** Proyecto con el que se abre la ventana; null es la vista general. */
    initial?: string | null;
    /** Cambia cada vez que se pide abrir la app: se vuelve a navegar a `initial`. */
    nav?: number;
  }

  let { projects, initial = null, nav = 0 }: Props = $props();

  const find = (id: string | null) => (id ? (projects.find((p) => p.id === id) ?? null) : null);

  let selected = $state<string | null>(untrack(() => find(initial)?.id ?? null));
  let lastNav = untrack(() => nav);

  // Con la ventana ya abierta, otro doble clic en un icono de proyecto (o en la carpeta) navega dentro de ella.
  $effect(() => {
    const n = nav;
    const target = initial;
    if (n === lastNav) return;
    lastNav = n;
    untrack(() => (selected = find(target)?.id ?? null));
  });

  const project = $derived(find(selected));

  // Selector por rol (S-13): estado de la ventana, así que se mantiene al ir al detalle y volver.
  let role = $state<RoleFilter>('all');
  const folder = $derived(inFolder(projects));
  const filters = $derived(roleFilters(folder));
  const visible = $derived(projectsForRole(folder, role));
</script>

{#if project}
  <ProjectDetail
    {project}
    onback={() => (selected = null)}
    onbrowser={() => dispatch({ type: 'open', target: { app: 'browser', arg: project.id } })}
  />
{:else}
  <div class="overview" data-testid="projects">
    <div class="head">
      <h2>Proyectos</h2>
      {#if filters.length > 1}
        <div class="roles" role="group" aria-label="Rol">
          {#each filters as f (f.id)}
            <button type="button" aria-pressed={role === f.id} data-testid={`projects-role-${f.id}`} onclick={() => (role = f.id)}>
              {f.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <ul class="grid">
      {#each visible as p (p.id)}
        <li>
          <button class="card" data-testid={`projects-card-${p.id}`} onclick={() => (selected = p.id)}>
            <span class="icon" aria-hidden="true"><AppIcon icon={projectIcon(p)} /></span>
            <span class="body">
              <span class="name">{p.name}</span>
              <span class="summary">{p.summary}</span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .overview {
    height: 100%;
    overflow-y: auto;
    padding: 20px 24px 32px;
    background: var(--win-bg);
    color: var(--fg);
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 16px;
    margin: 0 0 14px;
  }
  h2 {
    margin: 0;
    font-size: calc(20px * var(--text-scale));
  }
  /* Selector por rol (S-13): el mismo control segmentado que el idioma del CV y el nivel de las damas. */
  .roles {
    display: inline-flex;
    flex-wrap: wrap;
    padding: 2px;
    border-radius: var(--r-control);
    background: var(--surface);
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .roles button {
    min-height: 28px;
    padding: 0 10px;
    border-radius: calc(var(--r-control) - 2px);
    font-weight: 600;
    cursor: pointer;
    color: var(--fg);
  }
  .roles button[aria-pressed='true'] {
    color: var(--accent-fg);
    background: var(--accent-solid);
  }
  .roles button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .card {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    padding: 12px;
    border-radius: 12px;
    text-align: left;
    cursor: pointer;
    background: var(--win-bg);
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .card:hover {
    background: var(--hover);
    box-shadow: inset 0 0 0 1px var(--line-strong);
  }
  .icon {
    flex: none;
    width: 52px;
    height: 52px;
  }
  .body {
    display: grid;
    gap: 3px;
    min-width: 0;
  }
  .name {
    font-weight: 600;
    font-size: calc(15px * var(--text-scale));
  }
  .summary {
    color: var(--muted);
    line-height: 1.4;
  }
</style>

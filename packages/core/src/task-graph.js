export class TaskGraph {
  #dependencies = new Map();

  addTask(taskId) {
    if (!this.#dependencies.has(taskId)) {
      this.#dependencies.set(taskId, new Set());
    }
  }

  addDependency(taskId, dependsOnTaskId) {
    if (taskId === dependsOnTaskId) {
      throw new Error("task cannot depend on itself");
    }
    this.addTask(taskId);
    this.addTask(dependsOnTaskId);
    this.#dependencies.get(taskId).add(dependsOnTaskId);
    if (this.#hasCycle()) {
      this.#dependencies.get(taskId).delete(dependsOnTaskId);
      throw new Error(`dependency would create a cycle: ${taskId} -> ${dependsOnTaskId}`);
    }
  }

  dependenciesOf(taskId) {
    return [...(this.#dependencies.get(taskId) ?? [])];
  }

  isReady(taskId, completedIds) {
    return this.dependenciesOf(taskId).every((id) => completedIds.has(id));
  }

  readyTaskIds(taskIds, completedIds) {
    return taskIds.filter((id) => this.isReady(id, completedIds));
  }

  #hasCycle() {
    const visiting = new Set();
    const visited = new Set();

    const visit = (id) => {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;
      visiting.add(id);
      for (const dependency of this.#dependencies.get(id) ?? []) {
        if (visit(dependency)) return true;
      }
      visiting.delete(id);
      visited.add(id);
      return false;
    };

    return [...this.#dependencies.keys()].some(visit);
  }
}

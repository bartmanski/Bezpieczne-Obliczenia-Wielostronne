import PSIButton from "./PSIButton";

const styles = {
  container: { color: "white" },
};

export function PsiTest() {
  return (
    <div style={styles.container}>
      <p>PSI Test</p>
      <label>First set</label>
      <ul>
        <li>bob</li>
        <li>alice</li>
        <li>oscar</li>
      </ul>
      <label>Second set</label>
      <ul>
        <li>bob</li>
        <li>charlie</li>
        <li>delta</li>
      </ul>
      <PSIButton mySet={["bob", "charlie", "delta"]} />
    </div>
  );
}
